import { Directories } from "../../file_manager.js";
import { NameData, currentFormatVersion } from "../../utils.js";
import { MinecraftDataType } from "../minecraft.js";
import { FormatVersion, RawMessage } from "../shared_types.js";

export interface IServerDialogue {
    format_version: FormatVersion;
    ["minecraft:npc_dialogue"]: {
        scenes: IServerDialogueScene[];
    }
}

export interface IServerDialogueScene {
    npc_name: RawMessage;
    scene_tag: string;
    on_open_commands?: string[];
    on_close_commands?: string[];
    text: RawMessage;
    buttons?: {
        name: RawMessage;
        commands?: string[];
    }[];
}

export class ServerDialogue extends MinecraftDataType implements IServerDialogue {
    format_version: FormatVersion;
    ["minecraft:npc_dialogue"]: {
        scenes: IServerDialogueScene[];
    }

    public static get DirectoryPath(): string {
        return Directories.BEHAVIOR_PATH + 'dialogue/';
    }
    
    constructor(filepath: string, template: IServerDialogue) {
        super(filepath, template);
        this.format_version = template.format_version;
        this["minecraft:npc_dialogue"] = template["minecraft:npc_dialogue"];
    }

    public static createFromTemplate(nameData: NameData): ServerDialogue {
        return new ServerDialogue(this.createFilePath(nameData), {
            format_version: currentFormatVersion,
            "minecraft:npc_dialogue": {
                scenes: []
            }
        });
    }

    addScene(scene: IServerDialogueScene) {
        this["minecraft:npc_dialogue"].scenes.push(scene);
    }

    addButtonToAllScenes(button: {name: RawMessage, commands: string[]}) {
        this["minecraft:npc_dialogue"].scenes.forEach(scene => {
            scene.buttons = scene.buttons ?? [];
            scene.buttons.push(button);
        });
    }

    addToAllCloseCommands(...commands: string[]) {
        this["minecraft:npc_dialogue"].scenes.forEach(scene => {
            scene.on_close_commands = scene.on_close_commands ?? [];
            scene.on_close_commands.push(...commands);
        });
    }

    addToAllOpenCommands(...commands: string[]) {
        this["minecraft:npc_dialogue"].scenes.forEach(scene => {
            scene.on_open_commands = scene.on_open_commands ?? [];
            scene.on_open_commands.push(...commands);
        });
    }

    addToAllButtonCommands(...commands: string[]) {
        this["minecraft:npc_dialogue"].scenes.forEach(scene => {
            scene.buttons = scene.buttons ?? [];
            scene.buttons.forEach(button => {
                button.commands = button.commands ?? [];
                button.commands.push(...commands);
            });
        });
    }
}