-- Loaded only by the Neovim that `tp` or the desktop app starts.

-- Pick up files the tutor's engine writes or changes.
vim.o.autoread = true
vim.api.nvim_create_autocmd({ "FocusGained", "BufEnter", "CursorHold" }, {
  command = "silent! checktime",
})

local in_app = vim.env.TECHPREP_APP ~= nil

if in_app then
  -- The app shows the file name in its panel header, read from the terminal title.
  vim.o.title = true
  vim.o.titlestring = "%t"
end

-- <leader>tt: save, then run the tests (or the checks in a lesson file).
-- In tmux the results open in a bottom split; the app shows them in its test panel.
vim.keymap.set("n", "<leader>tt", function()
  vim.cmd("silent! write")
  local file = vim.fn.expand("%:p")
  if in_app then
    vim.fn.jobstart({ "tp", "test", file })
    return
  end
  vim.cmd("botright 14new")
  vim.fn.jobstart({ "tp", "test", file }, { term = true })
  vim.cmd("startinsert")
end, { desc = "tech-prep: run tests" })
