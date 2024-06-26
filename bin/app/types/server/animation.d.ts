import { NameData } from "../../utils.js";
import { MinecraftDataType } from "../minecraft.js";
import { FormatVersion } from "../shared_types.js";
export type ServerAnimationName = `animation.${string}`;
export interface IServerAnimation {
    format_version: FormatVersion;
    animations: {
        [key: ServerAnimationName]: IServerAnimationAnim;
    };
}
export interface IServerAnimationAnim {
    animation_length: number;
    anim_time_update?: string;
    loop?: boolean;
    timeline?: {
        [key: `${number}`]: string[];
    };
}
export declare class ServerAnimation extends MinecraftDataType implements IServerAnimation {
    format_version: FormatVersion;
    animations: {
        [key: ServerAnimationName]: IServerAnimationAnim;
    };
    static get DirectoryPath(): string;
    constructor(filepath: string, template: IServerAnimation);
    static createFromTemplate(nameData: NameData): ServerAnimation;
    addAnimation(key: ServerAnimationName, animation?: IServerAnimationAnim): void;
}
