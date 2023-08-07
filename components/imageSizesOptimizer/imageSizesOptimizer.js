import { Image, Dimensions } from "react-native"

function getBirdImageSize(imageUrl) {
    return new Promise((resolve, reject) => {
        Image.getSize(imageUrl, (width, height) => {
        resolve({ width, height });
        }, (error) => {
        console.error('Errore nel recupero delle dimensioni dell\'immagine:', error);
        reject(error);
        });
    });
}

export async function calculateOptimizedImageSize(imageUrl, setBirdImageWidth, setBirdImageHeight){
    try {
        let { width: originalWidth, height: originalHeight } = await getBirdImageSize(imageUrl)
        originalWidth += 50
    
        const screenWidth = Dimensions.get('window').width - 50
        const imageAspectRatio = originalWidth / originalHeight
        let newImageWidth = screenWidth;
        let newImageHeight = originalHeight;
      
        if (originalWidth > screenWidth) {
          newImageHeight = newImageWidth / imageAspectRatio;
        }

        setBirdImageHeight(newImageHeight)
        setBirdImageWidth(newImageWidth)
        
    } catch (error) {
        console.error('Errore durante il calcolo delle dimensioni ottimizzate dell\'immagine:', error);
    }
}