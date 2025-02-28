import { Utensils, Film, Music, Hop, Coffee, Dumbbell, Building, Mail } from "lucide-react";
import { NavItem, LocationItem, ContactItem } from "./types";
import { CloudinaryImage } from "@/components/ui/cloudinary-image";


export const cuisines: NavItem[] = [
  {
    title: "Pizza",
    href: "/cuisine/pizza",
    description: "Fresh and delicious pizza delivered to your door",
    icon: Utensils
  },
  {
    title: "Burgers",
    href: "/cuisine/burgers",
    description: "Juicy burgers with all your favorite toppings",
    icon: Utensils
  },
  {
    title: "Sushi",
    href: "/cuisine/sushi",
    description: "Premium sushi made with fresh ingredients",
    icon: Utensils
  },
  {
    title: "Chinese",
    href: "/cuisine/chinese",
    description: "Authentic Chinese dishes for every taste",
    icon: Utensils
  },
];

export const aboutUsItems: NavItem[] = [
  {
    title: "Hogis Cinema",
    href: "/about/cinema",
    description: "Experience movies in premium comfort",
    icon: Film
  },
  {
    title: "Club Voltage",
    href: "/about/club",
    description: "The best nightlife experience",
    icon: Music
  },
  {
    title: "Spar",
    href: "/about/spar",
    description: "Your one-stop shopping destination",
    icon: Hop
  },
  {
    title: "Lounges",
    href: "/about/lounges",
    description: "Relax in our premium lounges",
    icon: Coffee
  },
  {
    title: "Gym",
    href: "/about/gym",
    description: "State-of-the-art fitness center",
    icon: Dumbbell
  },
  {
    title: "Pool",
    href: "/about/pool",
    description: "Swim and unwind",
    icon: Utensils
  },
  {
    title: "Restaurants",
    href: "/about/restaurants",
    description: "Fine dining experiences",
    icon: Utensils
  },
];

export const locationItems: LocationItem[] = [
  {
    title: "Hogis Luxury Suites",
    href: "/locations/luxury-suites",
    description: "Experience ultimate luxury in our premium suites",
    icon: Building,
    mapUrl: "https://www.google.com/maps/embed?pb=!3m2!1sen!2sng!4v1740559598511!5m2!1sen!2sng!6m8!1m7!1s1XLBSMFQ48Gg0xxChyhjng!2m2!1d4.984198105203427!2d8.341314881769264!3f174.27125872112208!4f4.058230858658035!5f0.4000000000000002"
  },
  {
    title: "Hogis Royale & Apartments",
    href: "/locations/royale-apartments",
    description: "Elegant living spaces with world-class amenities",
    icon: Building,
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4588.6995652467895!2d8.33496535354881!3d4.985125359834808!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10678700409fa247%3A0x40bc4d920aa23fdc!2sHogis%20Royale%20and%20Apartments!5e0!3m2!1sen!2sng!4v1740560146115!5m2!1sen!2sng"
  },
  {
    title: "Hogis Exclusive Suites",
    href: "/locations/exclusive-suites",
    description: "Exclusive accommodations for discerning guests",
    icon: Building,
    mapUrl: "https://www.google.com/maps/embed?pb=!3m2!1sen!2sng!4v1740559333432!5m2!1sen!2sng!6m8!1m7!1seNa8cYJmEpPnzBwRBoWISQ!2m2!1d5.041537589324239!2d8.36131418682455!3f330.58891907271124!4f11.521297469347587!5f0.7820865974627469"
  },
];

export const contactItems: ContactItem[] = [
  {
    title: "General Inquiries",
    href: "mailto:info@hogis.com",
    description: "For general questions and information",
    icon: Mail,
    email: "info@hogis.com"
  },
  {
    title: "Reservations",
    href: "mailto:reservations@hogis.com",
    description: "Book your stay or make a reservation",
    icon: Mail,
    email: "reservations@hogis.com"
  },
  {
    title: "Customer Support",
    href: "mailto:support@hogis.com",
    description: "24/7 customer support and assistance",
    icon: Mail,
    email: "support@hogis.com"
  },
];