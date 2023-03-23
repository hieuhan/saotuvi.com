const config = require('../configs');

module.exports.getSlug = (slug) => {
    try {
        
        if(slug && slug.trim().length > 0){
            let result = slug;

            while(result.startsWith('/')){
                result = result.substring(1);
            }

            return `${ config.ROOT_PATH }${result}`;
        }
        
        return '';
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
}

module.exports.getFileSize = (size) =>{
    try {
        var fSExt = new Array('Bytes', 'KB', 'MB', 'GB'),
            i=0;while(size>900){size/=1024;i++;}
            return (Math.round(size*100)/100)+' '+fSExt[i];
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
}