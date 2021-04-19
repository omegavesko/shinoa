import { discordeno, log } from "../deps.ts";
import config from "./config.ts";

const token = Deno.env.get("TOKEN");
if (!token) {
  log.error("TOKEN variable is required.");
  Deno.exit(1);
}

const onReady = async () => {
  log.info("Connected to Discord gateway!");

  // while (!discordeno.cache.isReady) {
  // log.info(discordeno.cache.isReady);
  // await new Promise((a) => setTimeout(a, 1000));
  // }

  // console.log(config.guildCommands);

  // const existingCommands: Array<{
  //   id: string;
  //   name: string;
  // }> = await discordeno.getSlashCommands();

  // const commandsToCreate = config.commands.filter(
  //   (c) => existingCommands.find((ec) => ec.name === c.name) === undefined
  // );
  // const commandsToUpdate = config.commands.filter(
  //   (c) => existingCommands.find((ec) => ec.name === c.name) !== undefined
  // );

  log.info("Synchronizing global commands...");

  for (const command of config.commands) {
    await discordeno.createSlashCommand({
      name: command.name,
      description: command.description,
      options: command.options,
    });
    log.debug(`synced ${command.name}`);
  }

  for (const guildId in config.guildCommands) {
    const guild = discordeno.cache.guilds.get(guildId);
    // console.log(guild);
    log.info(`Synchronizing commands for guild ${guild?.name}...`);

    for (const command of config.guildCommands[guildId]) {
      await discordeno.createSlashCommand({
        name: command.name,
        description: command.description,
        options: command.options,
        guildID: guildId,
      });
      log.debug(`synced ${command.name}`);
    }
  }

  log.info("Initialization complete!");
};

discordeno.startBot({
  token,
  intents: ["GUILDS", "GUILD_MESSAGES"],
  eventHandlers: {
    ready: onReady,
    interactionCreate: (data) => {
      log.info(`Received interaction: ${data.data?.name}`);

      // for (const command of config.guildCommands[data.guild_id]) {
      //   if (command.name === data.data?.name) {
      //     command.process(data);
      //   }
      // }

      for (const command of config.commands) {
        if (command.name === data.data?.name) {
          command.process(data);
        }
      }
    },
    messageCreate: (data) => log.info(`received message: ${data.content}`),
  },
});
