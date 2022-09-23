import { NearestFilter, TextureLoader, RepeatWrapping } from "three"
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

// Making the textures look more pixelated, prevents smearing
dirtTexture.magFilter = NearestFilter;
logTexture.magFilter = NearestFilter;
grassTexture.magFilter = NearestFilter;
woodTexture.magFilter = NearestFilter;
glassTexture.magFilter = NearestFilter;
groundTexture.magFilter = NearestFilter;

groundTexture.wrapS = RepeatWrapping;
groundTexture.wrapT = RepeatWrapping;

export {
    dirtTexture,
    logTexture,
    grassTexture,
    woodTexture,
    glassTexture,
    groundTexture
};
