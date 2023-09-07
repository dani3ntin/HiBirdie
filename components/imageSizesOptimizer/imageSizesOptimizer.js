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

export async function calculateOptimizedImageSize(imageUrl, decreaseScreenWidth, setBirdImageWidth, setBirdImageHeight){
    try {
        let { width: originalWidth, height: originalHeight } = await getBirdImageSize(imageUrl)
        originalWidth += 50
    
        const screenWidth = Dimensions.get('window').width - decreaseScreenWidth
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

export async function calculateFullScreenImageSize(imageUrl, setBirdImageWidth, setBirdImageHeight){
    try {
        let { width: originalWidth, height: originalHeight } = await getBirdImageSize(imageUrl)
    
        const screenWidth = Dimensions.get('window').width
        const imageWidth = originalWidth;
        const imageHeight = originalHeight;
        const imageAspectRatio = imageHeight / imageWidth;
        const newImageHeight = screenWidth * imageAspectRatio;

        setBirdImageHeight(newImageHeight)
        setBirdImageWidth(screenWidth)
        
    } catch (error) {
        console.error('Errore durante il calcolo delle dimensioni ottimizzate dell\'immagine:', error);
    }
}

export async function calculateOptimizedLocalImageSize(imageUrl, decreaseScreenWidth, setBirdImageWidth, setBirdImageHeight){
    try {
        if(!imageUrl){
            return
        }
        let originalWidth = imageUrl[0].width
        let originalHeight = imageUrl[0].height
        console.log(originalWidth, originalHeight)
        originalWidth += 50
    
        const screenWidth = Dimensions.get('window').width - decreaseScreenWidth
        const imageAspectRatio = originalWidth / originalHeight
        let newImageWidth = screenWidth;
        let newImageHeight = originalHeight;
      
        if (originalWidth > screenWidth) {
          newImageHeight = newImageWidth / imageAspectRatio;
        }

        setBirdImageHeight(newImageHeight)
        setBirdImageWidth(newImageWidth)
        
    } catch (error) {
        console.error('Errore durante il calcolo delle dimensioni ottimizzate dell\'immagine:', error)
    }
}