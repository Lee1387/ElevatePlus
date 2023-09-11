import { Guild as DatabaseGuild } from "../interfaces";
import { Button } from "../interfaces/Button";
import { setLevelRoles } from "../modules/guild";
import { getConfigMessagePayload } from "../modules/messages";
import { syncGuildLevelRoles } from "../modules/roles";

const levelRoles: Button = {
    customId: `levelRoles`,
    run: async (client, interaction) => {
        if(!interaction.guild) return;

        await interaction.deferUpdate();
        await setLevelRoles(interaction.guild) as DatabaseGuild;
        await syncGuildLevelRoles(client, interaction.guild);
        
        const configMessage = await getConfigMessagePayload(client, interaction.guild);
        await interaction.editReply({
            components: configMessage!.components
        });
    }
}

export default levelRoles;