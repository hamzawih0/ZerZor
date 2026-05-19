#!/usr/bin/env node
import { Command } from "commander";
import { registerConfigCommand } from "./commands/config.js";
import { registerCreateCommand } from "./commands/create.js";
import { registerListCommand } from "./commands/list.js";
import { registerWaitCommand } from "./commands/wait.js";
import { registerReadCommand } from "./commands/read.js";
import { registerDeleteCommand } from "./commands/delete.js";
import { registerSendCommand } from "./commands/send.js";
import { registerSkillCommand } from "./commands/skill.js";

const program = new Command();

program
  .name("ZorMail")
  .description("ZorMail CLI — Agent-friendly temporary email tool")
  .version("0.1.2")
  .option("--json", "output as JSON");

registerConfigCommand(program);
registerCreateCommand(program);
registerListCommand(program);
registerWaitCommand(program);
registerReadCommand(program);
registerDeleteCommand(program);
registerSendCommand(program);
registerSkillCommand(program);

program.parse();


