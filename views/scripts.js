document.addEventListener('DOMContentLoaded', () => {
    function sendTTSMessage(message) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(message);
            speechSynthesis.speak(utterance);
        }
    }

    function fetchYOLOResults() {
        fetch('http://<server-ip>:<server-port>/yolo-handler')  // 서버의 URL로 변경
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const message = `Detected objects are: ${data.join(', ')}`;
                    sendTTSMessage(message);
                }
            })
            .catch(error => console.error('Error fetching YOLO results:', error));
    }

    setInterval(fetchYOLOResults, 10000);

    document.getElementById('test-notification').addEventListener('click', () => {
        sendTTSMessage('우측에 보행자가 있습니다. 주의하세요.');
    });
});
