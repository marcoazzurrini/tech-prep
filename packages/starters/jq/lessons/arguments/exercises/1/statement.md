Print every server whose `env` equals the value passed to the command.

The command below passes `prod` under the name `env`. But the filter does not use it: it compares with the fixed text `"dev"`. Replace `"dev"` with the variable `$env`.
