const net = require('net');
const port = 3000;
const host = '196.219.155.101';

const server = net.createServer();
server.listen(port, host, () => {
    console.log('TCP Server is running on port ' + port + '.');
});

let sockets = [];

server.on('connection', (socket) => {
    console.log('CONNECTED: ' + socket.remoteAddress + ':' + socket.remotePort);
    sockets.push(socket);
    
    var timestamp = Math.floor(Date.now()/1000);

    socket.on('data', async function(data) {
	let comingFromClientArray;
	console.log(timestamp+'\n');
	let define_inst = data.toString();
	let slice_code = define_inst.slice(',') ;
	console.log("==========================");

    async function getCommand (){
        if(define_inst.startsWith('*SCOS')&&slice_code[3]=='R0'){
            if(slice_code[3]=='0'){
                console.log(`${slice_code[3]} Request unlock Lock .`);
                console.log(`${slice_code[3]} code SERVER ---> LOCK : ${slice_code[4]} `);
                let code = `0xFFFF*SCOS,OM,${slice_code[2]},${slice_code[3]},0,20,10234,${timestamp}#\n`;
                socket.write(code);
                console.log(`Packet sent SERVER to LOCK --> ${code} `);
                
            }
        }
    }
    async function processOperator(){

            if(slice_code[1] == "*SCOR" && slice_code[3] == "R0" && slice_code[4] == "0" && slice_code[5] != "20"){
                let code = `0xFFFF*SCOS,OM,${slice_code[2]},L0,0,${slice_code[3]},10234,${timestamp}#\n`;
                console.log(`Packet SERVER ---> LOCK ${code}`);
            }

    }

    getCommand ();
    processOperator();
	
	
        console.log('DATA ' + socket.remoteAddress + ': ' + data);
        // Write the data back to all the connected, the client will receive it as data from the server
        sockets.forEach(function(socket, index, array) {
            socket.write(socket.remoteAddress + ':' + socket.remotePort + " said " + data + '\n');
        });
    });

    // Add a 'close' event handler to this instance of socket
    socket.on('close', function(data) {
        let index = sockets.findIndex(function(o) {
            return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
        })
        if (index !== -1) sockets.splice(index, 1);
        console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
    });
});
