const newUser = () => {

  return (
    <div>
      <form method="post" action="/api/accounts/register">
        <label>
          New User Registration <br />
        </label>
        <label>
          Email Address
          <input name="username" type="text" />
        </label>
        <label>
          Password
          <input name="password" type="password" />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default newUser;
