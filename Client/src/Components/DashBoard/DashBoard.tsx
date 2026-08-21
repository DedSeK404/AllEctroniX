import { useNavigate } from 'react-router-dom';

export default function App() {
const navigate = useNavigate();

  return (
   <div className="navbar bg-base-100 shadow-sm">
  <div className="navbar-start">
    <a className="btn btn-ghost text-xl">daisyUI</a>
  </div>
  <div className="navbar-center">
    <div className="megamenu max-sm:megamenu-vertical megamenu-full" id="my-megamenu-4" popover="auto">
      <span className="megamenu-active"></span>
      <button popoverTarget="d1">One</button>
      <div id="d1" popover="auto">
        <div className="flex max-sm:flex-col items-start">
          <ul className="menu w-full md:menu-horizontal">
            <li>
              <a>Enterprise</a>
              <ul>
                <li><a>CRM software</a></li>
                <li><a>Marketing management</a></li>
                <li><a>Security</a></li>
                <li><a>Consulting</a></li>
              </ul>
            </li>
            <li>
              <a>Company</a>
              <ul>
                <li><a>About us</a></li>
                <li><a>Contact us</a></li>
                <li><a>Privacy policy</a></li>
                <li><a>Press kit</a></li>
              </ul>
            </li>
          </ul>
          <img src="https://img.daisyui.com/images/stock/photo-1559181567-c3190ca9959b.webp" className="md:max-w-sm max-md:hidden" alt="Tailwind CSS megamenu" />
        </div>
      </div>
      <button popoverTarget="d2">Two</button>
      <div id="d2" popover="auto">
        <div className="flex max-sm:flex-col items-start">
          <ul className="menu w-full md:menu-horizontal">
            <li>
              <a>Enterprise</a>
              <ul>
                <li><a>CRM software</a></li>
                <li><a>Marketing management</a></li>
                <li><a>Security</a></li>
                <li><a>Consulting</a></li>
                <li><a>Privacy policy</a></li>
                <li><a>Press kit</a></li>
              </ul>
            </li>
            <li>
              <a>Products</a>
              <ul>
                <li><a>UI Kit</a></li>
                <li><a>WordPress themes</a></li>
                <li><a>WordPress plugins</a></li>
                <li><a>Color picker app</a></li>
                <li><a>About us</a></li>
                <li><a>Contact us</a></li>
              </ul>
            </li>
          </ul>
          <img src="https://img.daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.webp" className="md:max-w-sm max-md:hidden" alt="Tailwind CSS megamenu component" />
        </div>
      </div>
      <button popoverTarget="d3">Three</button>
      <div id="d3" popover="auto">
        <div className="flex max-sm:flex-col items-start">
          <ul className="menu w-full md:menu-horizontal">
            <li>
              <a>Solutions</a>
              <ul>
                <li><a>Design</a></li>
                <li><a>Development</a></li>
                <li><a>Hosting</a></li>
                <li><a>Domain register</a></li>
              </ul>
            </li>
            <li>
              <a>Products</a>
              <ul>
                <li><a>UI Kit</a></li>
                <li>
                  <a>Open source</a>
                  <ul>
                    <li><a>Auth management system</a></li>
                    <li><a>VScode theme</a></li>
                    <li><a>Color picker app</a></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              <a>Company</a>
              <ul>
                <li><a>About us</a></li>
                <li><a>Contact us</a></li>
                <li><a>Privacy policy</a></li>
                <li><a>Press kit</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <div className="navbar-end">
    <a className="btn" onClick={() => navigate('/login/signin')}>Login</a>
    <button className="btn sm:hidden" popoverTarget="my-megamenu-4">Menu</button>
  </div>
</div>
  );
}