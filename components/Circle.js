const Circle = ({bgColor}) => {
  return (
    <div className="circleStyle">
      <style jsx>{`
      .circleStyle  {
        padding: 0px;
        margin-right: 1px;
        margin-left: 1px;
        margin-top: 0px;
        display: inline-block;
        background-color: ${bgColor};
        border-radius: 50%;
        width: 15px;
        height: 15px;
      }
      `}</style>
    </div>
  );
}
export default Circle