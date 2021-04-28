export class Utils{
    static async loadImage(img, src){
        return new Promise(resolve => {
            img.onload = () => resolve();
            img.src = src;
        });
    }
}