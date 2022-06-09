import fs from 'fs';

export function deleteFile(filePath){
    console.log(filePath);
    fs.unlink('\app\\'+filePath,(err)=>{
        if(err){throw Error(err);}
    })
}