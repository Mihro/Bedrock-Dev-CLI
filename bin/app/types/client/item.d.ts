import { NameData } from "../../utils";
import { MinecraftDataType } from "../minecraft";
import { FormatVersion, Identifier } from "../shared_types";
export interface IClientItem {
    format_version: FormatVersion;
    ["minecraft:item"]: IClientItemItem;
}
export interface IClientItemItem {
    description: IClientItemDescription;
    components: IClientItemComponents;
}
export interface IClientItemDescription {
    identifier: Identifier;
    category?: string;
}
export interface IClientItemComponents {
    ["minecraft:icon"]?: string;
    ["minecraft:render_offsets"]?: string;
}
export declare class ClientItem extends MinecraftDataType implements IClientItem {
    format_version: FormatVersion;
    ["minecraft:item"]: IClientItemItem;
    static get DirectoryPath(): string;
    constructor(filepath: string, template: IClientItem);
    static createFromTemplate(nameData: NameData): ClientItem;
    setDisplayData(name: NameData): void;
}
