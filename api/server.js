const http = require('http')
const numCPU = require('os').cpus().length;
const cluster = require('cluster');
const app = require('./app')

const settings = require('./settings')
const environment = require("./config/"+settings.environment)

const port = settings.port

if(cluster.isMaster){
    console.log(`Master ${process.pid} is running ${numCPU}`);

    // Fork workers.
    for (let i = 0; i < numCPU; i++) {
      cluster.fork();
    }
  
    cluster.on('exit', (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
    });
}else{
    app.listen(port,environment.IP_ADDRESS,()=>{
       console.log(`server ${port} successfully`);
    })
    console.log(`Worker ${process.pid} started`);

}
// app.listen(port,environment.IP_ADDRESS,()=>{
//          console.log(`server ${port} successfully`);
//       })