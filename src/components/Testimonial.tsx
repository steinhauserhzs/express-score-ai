import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface TestimonialProps {
  name: string;
  role: string;
  content: string;
  rating: number;
  initials: string;
}

export default function Testimonial({ name, role, content, rating, initials }: TestimonialProps) {
  return (
    <Card className="p-6 hover-lift h-full">
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "fill-primary text-primary" : "text-muted"
            }`}
          />
        ))}
      </div>
      
      <p className="text-foreground mb-6 leading-relaxed">{content}</p>
      
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
    </Card>
  );
}
