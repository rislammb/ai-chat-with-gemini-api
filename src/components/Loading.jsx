import classes from "./styles.module.css";

const Loading = () => {
  return (
    <div className="answer">
      <h3 className={classes.heading_loader} />
      <p className={classes.text_loader} />
      <p className={classes.text_loader} />
    </div>
  );
};

export default Loading;
