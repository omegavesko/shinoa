import { commands } from "./modules";
import environment from "./environment";
import { Command } from "./internal/command";
export { handlers } from "./modules";

interface Config {
  ownerId: string;
  applicationId: string;
  globalCommands: Command[];
  guilds: {
    [key: string]: { commands?: Command[] };
  };
}

const config: Config = {
  ownerId: "98225142064250880",
  applicationId: environment.isProduction
    ? "833659808187678771"
    : "838072375063871559",
  globalCommands: commands,
  guilds: environment.isProduction
    ? {
        // Vesko's Workshop
        ["161167668131397642"]: {
          commands,
        },
      }
    : {
        // Vesko's Workshop
        ["161167668131397642"]: {
          commands,
        },
      },
};

export default config;
