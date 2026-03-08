import { Link } from "react-router-dom";
import { X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/hooks/use-compare";

const CompareBar = () => {
  const { items, removeFromCompare, clearCompare } = useCompare();

  if (items.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur shadow-lg"
      >
        <div className="container-main py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-x-auto">
            <span className="text-sm font-medium text-card-foreground shrink-0">
              So sánh ({items.length}/3):
            </span>
            {items.map((p) => (
              <div key={p.id} className="flex items-center gap-2 rounded-xl border border-border bg-muted px-3 py-1.5 shrink-0">
                <img src={p.image} alt="" className="h-8 w-8 rounded-lg object-cover" />
                <span className="text-xs font-medium text-card-foreground max-w-[120px] truncate">{p.name}</span>
                <button onClick={() => removeFromCompare(p.id)} className="text-muted-foreground hover:text-destructive">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={clearCompare} className="text-xs text-muted-foreground hover:text-foreground underline">
              Xóa
            </button>
            {items.length >= 2 && (
              <Link to="/compare">
                <Button size="sm" className="rounded-xl gap-1">
                  So sánh <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CompareBar;
