import videoPost from './VideoPost';
import getGeoposition from './geoposition';
import Modal from './Modal';
import validate from './validation';

export default async function requestVideo() {
  if (!navigator.mediaDevices || !window.MediaRecorder) {
    throw new Error('Запись видео недоступна');
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const recorder = new MediaRecorder(stream);
    const VideoPost = new VideoPost();
    videoPost.createVideoCtrl();
    let sec = 0;
    let min = 0;
    let click = false;
    const chunks = [];
    recorder.start(1000);

    recorder.addEventListener('dataavailable', (evt) => {
      const secStr = sec < 10 ? `0${sec}` : `${sec}`;
      const minStr = min < 10 ? `0${min}` : `${min}`;

      videoPost.timer.textContent = `${minStr}:${secStr}`;
      sec += 1;
      if (sec > 60) {
        sec = 0;
        min += 1;
      }
      chunks.push(evt.data);
    });

    recorder.addEventListener('stop', () => {
      videoPost.remoteVideoCtrl();
      const blob = new Blob(chunks);
      const src = URL.createObjectURL(blob);
      stream.getTracks().forEach((track) => track.stop());
      if (click) {
        getGeoposition()
          .then((data) => {
            const { latitude, longitude } = data;
            videoPost.createVideoPost(`[${latitude}, ${longitude}]`, src);
          })
          .catch(() => {
            const modal = new Modal();
            modal.modalForm = document.querySelector('.modal');

            modal.modalForm.addEventListener('click', (e) => {
              e.preventDefault();
              if (e.target.classList.contains('cancel-btn') || !e.target.closest('.form')) {
                e.currentTarget.remove();
              }

              if (e.currentTarget.querySelector('.mistake-modal')) {
                e.currentTarget.querySelector('.mistake-modal').remove();
              }

              if (e.target.classList.contains('ok-btn')) {
                const input = e.currentTarget.querySelector('.form').geopos.value;

                if (input !== '') {
                  try {
                    const pos = validate(input);
                    e.currentTarget.remove();
                    videoPost.createVideoPost(`[${pos.latitude}, ${pos.longitude}]`, src);
                  } catch (err) {
                    modal.showMistake('Введены неверные данные');
                  }
                } else {
                  modal.showMistake('Пустая строка');
                }
              }
            });
          });
      }
    });

    videoPost.ctrlVideo.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-cancel')) {
        recorder.stop();
      }

      if (e.target.classList.contains('ready-btn')) {
        click = true;
        recorder.stop();
      }
    });
  } catch (e) {
    throw new Error('Запись видео недоступна');
  }
}
