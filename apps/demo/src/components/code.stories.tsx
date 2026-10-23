import type { Meta, StoryObj } from "@storybook/react-vite";
import { CodeBlock, EditorStatus } from "@tech-prep/ui";

const meta = {
  args: {
    code: 'const s = new Set([1, "1", NaN, NaN, {}, {}]);\nconsole.log(s.size); // how many?',
  },
  component: CodeBlock,
  decorators: [
    (Story) => (
      <div style={{ width: 720 }}>
        <Story />
      </div>
    ),
  ],
  title: "Components/Code",
} satisfies Meta<typeof CodeBlock>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Snippet: Story = {};

export const Editor: Story = {
  args: {
    code: "def contains_duplicate(nums):\n    seen = set()\n    for n in nums:\n        if n in seen:\n            return True\n        seen.add(n)\n    return False",
    currentLine: 4,
    lineNumbers: true,
  },
  render: (args) => (
    <>
      <CodeBlock {...args} />
      <EditorStatus cursor="4:22" file="contains_duplicate.py" mode="INSERT" />
    </>
  ),
};
