import { Directories } from "../../file_manager.js";
import { NameData, currentFormatVersion } from "../../utils.js";
import { MinecraftDataType } from "../minecraft.js";
import { FormatVersion, Identifier, SlotOptions } from "../shared_types.js";

export interface IServerItem {
    format_version: FormatVersion;
    ["minecraft:item"]: IServerItemItem;
}

export interface IServerItemItem {
    description: IServerItemDescription;
    components: IServerItemComponents;
}

export interface IServerItemDescription {
    identifier: Identifier;
    category?: string;
    menu_category?: {
        category: string;
        group?: string;
        is_hidden_in_commands?: boolean;
    }
}

export interface IServerItemComponents {
    ["minecraft:icon"]?: {
        texture: string;
    };

    ["minecraft:display_name"]?: {
        value: string;
    };

    ["minecraft:tags"]?: {
        tags: string[];
    }

    ["minecraft:durability"]?: {
        damage_chance?: {
            min: number;
            max: number;
        }
        max_durability: number;
    };

    ["minecraft:food"]?: {
        can_always_eat?: boolean;
        nutrition?: number;
        saturation_modifier?: number;
        using_converts_to?: string;
    };

    ["minecraft:interact_button"]?: string|boolean;

    ["minecraft:max_stack_size"]?: {
        value: number;
    };

    ["minecraft:repairable"]?: {
        on_repaired?: string;
        repair_items?: {
            items: Identifier[];
            repair_amount: number|string;
        }[];
    };

    ["minecraft:wearable"]?: {
        dispensable?: boolean;
        slot: SlotOptions;
        protection: number
    };

    ["minecraft:enchantable"]?: {
        value: number;
        slot: string;
    };

    ["minecraft:use_modifiers"]?: {
        use_duration: number;
        movement_modifier: number;
    };

    ["minecraft:cooldown"]?: {
        category: string;
        duration: number;
    };

    [key: string]: any;
}

export class ServerItem extends MinecraftDataType implements IServerItem {
    format_version: FormatVersion;
    ["minecraft:item"]: IServerItemItem;

    public static get DirectoryPath(): string {
        return Directories.BEHAVIOR_PATH + 'items/';
    }

    constructor(filepath: string, template: IServerItem) {
        super(filepath, template);
        this.format_version = template.format_version;
        this["minecraft:item"] = template["minecraft:item"];
    }

    public static createFromTemplate(nameData: NameData): ServerItem {
        return new ServerItem(this.createFilePath(nameData), {
            format_version: currentFormatVersion,
            "minecraft:item": {
                description: {
                    identifier: nameData.fullname as Identifier
                },
                components: {}
            },
        });
    }

    setDisplayData(name: NameData) {
        this["minecraft:item"].description.identifier = name.fullname as Identifier;
        this["minecraft:item"].components["minecraft:display_name"] = {
            value: `item.${name.fullname}.name`
        };
        this["minecraft:item"].components["minecraft:icon"] = {
            texture: name.fullname
        };
    }

    setStackSize(stack: number) {
        this["minecraft:item"].components["minecraft:max_stack_size"] = {
            value: stack
        };
    }

    setWearable(slot: SlotOptions, protectionPoints: number) {
        this["minecraft:item"].components["minecraft:wearable"] = {
            slot: slot,
            dispensable: true,
            protection: Math.trunc(protectionPoints),
        };
        this["minecraft:item"].components["minecraft:repairable"] = {
            repair_items: [
                {
                    items: [
                        this["minecraft:item"].description.identifier
                    ],
                    repair_amount: "query.remaining_durability + 0.05 * query.max_durability",
                }
            ]
        };
        this["minecraft:item"].components["minecraft:enchantable"] = {
            value: 10,
            slot: enchantSlot(slot),
        };
    }

    setFood() {
        this["minecraft:item"].components["minecraft:food"] = {
            can_always_eat: true,
            nutrition: 10,
            saturation_modifier: 10,
        }
    }

    setCooldown(duration: number, category?: string) {
        this["minecraft:item"].components["minecraft:cooldown"] = {
            duration,
            category: category ? category : new NameData(this["minecraft:item"].description.identifier).shortname,
        }
    }

    setModifiers(use_duration: number = 30000, movement_modifier: number = 1) {
        this["minecraft:item"].components["minecraft:use_modifiers"] = {
            use_duration: use_duration,
            movement_modifier: movement_modifier,
        }
    }

    setInteractButton(name: NameData) {
        this["minecraft:item"].components["minecraft:interact_button"] = `action.hint.interact.${name.fullname}`;
    }
}

function enchantSlot(slot: SlotOptions): string {
    switch (slot) {
        case "slot.armor.feet":
            return 'armor_feet';
        case "slot.armor.legs":
            return "armor_legs";
        case "slot.armor.chest":
            return "armor_torso";
        case "slot.armor.head":
            return "armor_head";
        default:
            return '';
    }
}