import classes from "./comment-list.module.css";

function CommentList(props) {
  return (
    <ul className={classes.comments}>
      {props.items.map(({ _id, email, name, text }) => (
        <li key={_id}>
          <p>{text}</p>
          <div>
            By <address>{name}</address>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default CommentList;
