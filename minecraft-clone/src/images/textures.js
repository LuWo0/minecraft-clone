import { TextureLoader } from "three"
import {
    dirtImg,
    logImg,
    grassImg,
    woodImg,
    glassImg
} from "./images"

// Instantiating the textures and loading for each image
const dirtTexture = new TextureLoader().load(dirtImg);
const logTexture = new TextureLoader().load(logImg);
const grassTexture = new TextureLoader().load(grassImg);
const woodTexture = new TextureLoader().load(woodImg);
const glassTexture = new TextureLoader().load(glassImg);
const groundTexture = new TextureLoader().load(grassImg);

export {
    dirtTexture,
    logTexture,
    grassTexture,
    woodTexture,
    glassTexture,
    groundTexture
};
