
     
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

function Footer() {
  return (
    <footer className="border-t border-purple-100 bg-purple-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">

        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="text-purple-700" size={20} />
          <span className="font-bold text-purple-800">
            BlogSphere
          </span>
        </Link>

        <p className="text-sm text-gray-600">
          A place for ideas, stories, and knowledge.
        </p>

        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} BlogSphere
        </p>

      </div>
    </footer>
  );
}

export default Footer;
 
   