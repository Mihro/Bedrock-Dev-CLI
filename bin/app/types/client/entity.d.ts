import { NameData } from "../../utils.js";
import { MinecraftDataType } from "../minecraft.js";
import { FormatVersion, Identifier, MolangOption } from "../shared_types.js";
export interface IClientEntity {
    format_version: FormatVersion;
    ['minecraft:client_entity']: {
        description: IClientEntityDescription;
    };
}
export type ClientEntityTexturePath = `textures/${string}`;
export type ClientEntityGeometryReference = `geometry.${string}`;
export interface IClientEntityDescription {
    identifier: Identifier;
    min_engine_version?: FormatVersion;
    materials?: Record<string, string>;
    textures?: Record<string, ClientEntityTexturePath>;
    geometry?: Record<string, ClientEntityGeometryReference>;
    scripts?: IClientEntityScripts;
    animations?: Record<string, string>;
    animation_controllers?: Record<string, string>[];
    render_controllers?: MolangOption[];
    spawn_egg?: IClientEntitySpawnEgg;
    enable_attachables?: boolean;
    held_item_ignores_lightning?: boolean;
    hide_armor?: boolean;
    particle_effects?: Record<string, string>;
    particle_emitters?: Record<string, string>;
    sound_effects?: Record<string, string>;
}
export interface IClientEntityScripts {
    initialize?: string[];
    pre_animation?: string[];
    animate?: MolangOption[];
    parent_setup?: string;
    scale?: string | number;
    scalex?: string | number;
    scaley?: string | number;
    scalez?: string | number;
    should_update_bones_and_effects_offscreen?: string | boolean;
    should_update_effects_offscreen?: string | boolean;
    variables?: Record<string, string>;
}
export interface IClientEntitySpawnEgg {
    base_color?: string;
    overlay_color?: string;
    texture?: string;
    texture_index?: number;
}
export declare class ClientEntity extends MinecraftDataType implements IClientEntity {
    format_version: FormatVersion;
    ['minecraft:client_entity']: {
        description: IClientEntityDescription;
    };
    static get DirectoryPath(): string;
    constructor(filepath: string, template: IClientEntity);
    static createFromTemplate(nameData: NameData): ClientEntity;
    static createFilePath(nameData: NameData): string;
    upgradeFormatVersion(): void;
    addInitializeVariable(...variables: string[]): void;
    addPreAnimationVariable(...variables: string[]): void;
    addMaterials(...materials: {
        name: string;
        reference: string;
    }[]): void;
    addGeometry(...geometry: {
        name: string;
        reference: ClientEntityGeometryReference;
    }[]): void;
    addRenderController(...render_controllers: MolangOption[]): void;
    addAnimation(...animations: {
        name: string;
        reference: string;
    }[]): void;
    addAnimateScript(...animations: ({
        [key: string]: string;
    } | string)[]): void;
    addPublicVariable(...variables: string[]): void;
}
