import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

interface Contact {
  ContactType: string;
  Name: string;
  Email: string;
}

interface ContactsProps {
  settings: {
    Contacts: Contact[];
  };
  className?: string;
}

export default function Contacts({ settings, className }: ContactsProps) {
  const validContacts = settings.Contacts.filter((contact) => contact.Email);

  if (validContacts.length === 0) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle>CPL Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No contact information available.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardContent className="py-4">
        <ul className="space-y-4">
          {validContacts.map((contact) => (
            <li
              key={contact.Email}
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="" alt={contact.Name} />
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="px-3">
                  <p className="text-sm font-bold leading-none">
                    {contact.ContactType}
                  </p>
                  <p className="text-sm font-medium leading-none">
                    {contact.Name}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
