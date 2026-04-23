export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>IoT</h2>
      <nav>
        <a href="#">Overview</a>
        <a href="#" className="active">Temperature</a>
        <a href="#">Gas</a>
        <a href="#">Fridge</a>
        <a href="#">Fire</a>
      </nav>
    </aside>
  );
}
