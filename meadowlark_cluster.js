const cluster = require('cluster');

function startWorker() {
  const worker = cluster.fork();
  console.log('CUSTER: Worker %d started', worker.id)
}

if (cluster.isMaster) {
  require('os').cpus().forEach(() => {
    startWorker();
  });

  cluster.on('disconnect', worker => {
    console.log('CLUSTER: Worker %d disconnected form the cluster', worker.id);
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log('CLUSTER: Worker %d died with exit code %d(%s)', worker.id, code, signal);
    startWorker();
  })
} else {
  require('./meadowlark')();
}
