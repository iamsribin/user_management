import loading_gif from '../assets/loading-gif.gif'
const Loading = () => {
  return (
    <div className="w-96 h-80 flex items-center justify-center">
      <img src={loading_gif} alt="loadgin-gif...." />
    </div>
  );
};

export default Loading;
