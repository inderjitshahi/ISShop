import fs from 'fs';

export function deleteFile(filePath){
    console.log(filePath);
    fs.unlink(filePath,(err)=>{
        if(err){throw Error(err);}
    })
}