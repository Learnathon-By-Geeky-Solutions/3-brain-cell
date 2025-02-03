const OverlapeCard = ({ data }) => {
  return (
    <>
      <div
        className="group cursor-pointer relative h-70 w-70 rounded-2xl text-center bg-gray-300 overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: `url(${data.image})`,
        }}
      >
        <span className="bg-amber-400 px-3 py-1 rounded absolute left-3 top-2">
          {data.category}
        </span>
        <p className="absolute text-xl text-black font-bold bottom-0 left-0 w-full p-10 bg-gray-50/25 transform translate-y-full transition-transform duration-400 group-hover:translate-y-0">
          {data.title}
        </p>
      </div>
    </>
  );
};
export default OverlapeCard;
