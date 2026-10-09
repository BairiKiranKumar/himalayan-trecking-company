export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__cols">
        <nav aria-label="Footer">
          <ul>
            <li><a href="#treks">Treks</a></li>
            <li><a href="#route">The route</a></li>
            <li><a href="#leaders">Leaders</a></li>
            <li><a href="#book">Enquire</a></li>
          </ul>
        </nav>
        <p>
          Rajpur Road, Dehradun
          <br />
          Treks run from March to December
        </p>
        <p>© {new Date().getFullYear()} Himalayan Trekking Co.</p>
      </div>
      <p className="footer__mark" aria-hidden="true">Himalayan Trekking Co.</p>
    </footer>
  );
}
