function setSource(origin: any, document: Document) {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_PATH}/api/cuevana?url=${origin}`)
    .then(res => res.json())
    .then(data => {
        let video = document.getElementById('player') as any;
        console.log(video);
        video.src = data.src;            
    });
}

export {
    setSource
}