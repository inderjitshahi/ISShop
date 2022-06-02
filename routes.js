import fs from 'fs';

const requestHandler=(req,res)=>{
    const url = req.url;  //getting the req url
    const method = req.method;  //getting the req url
    if (url === '/') {
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<body><form action="/message" method="POST" name="message"><input type="text" placeholder="Type Here" name="message"><input type="submit" ></form></body></html>');
        return res.end();
    }
    
    if (url === '/message' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {  //listning 'data' event, fired when chunk is ready
            console.log(chunk);
            body.push(chunk);
        });
    
        return req.on('end', () => {   //fired when parsing is complete
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];

            // fs.writeFileSync('message.txt', message);  //sync Blocking
            // res.statusCode = 302;  //redirecting code
            // res.setHeader('Location', '/');  //whrere to be redirected
            // return res.end();
    
            // //Async Non-Blocking
            fs.writeFile('message.txt', message, (err) => {
                //executing once fs.writeFile is done    
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
            });
        });
    }

};

export default requestHandler;