export default function SignupPage() {
  return (
    <div>
      <h1>Sign up</h1>
      <form>
        <label>
          Email
          <input type="email" />
        </label>
        <label>
          Password
          <input type="password" />
        </label>
        <button type="submit">Sign up</button>
      </form>
    </div>
  )
}
