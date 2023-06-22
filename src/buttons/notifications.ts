import { Button } from "../interfaces/Button";
import { setNotifications } from "../modules/guild";
import { getConfigMessagePayload } from "../modules/messages";

const notifications: Button = {
    customId: `notifications`,
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });
        await setNotifications(interaction.guild!);

        const configMessage = await getConfigMessagePayload(client, interaction.guild!);
        await interaction.followUp({ ...configMessage, ephemeral: true })
    }
}

export default notifications;