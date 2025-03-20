import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

interface ContactType {
  Description: string;
}

interface Contact {
  Description: string;
  ContactName: string;
  ContactEmail: string;
  ContactType: ContactType;
}

interface ContactsProps {
  settings: {
    Contacts: Contact[];
  };
  className?: string;
}

export default function Contacts({ settings, className }: ContactsProps) {
  const validContacts = settings.Contacts.filter((contact) => contact.ContactName);

  if (validContacts.length === 0) {
    return <EmptyContactsCard className={className} />;
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardContent className="py-4">
        <ul className="space-y-4">
          {validContacts.map((contact, index) => (
            <ContactItem
              key={`${contact.ContactType.Description}-${contact.ContactName}-${contact.ContactEmail}-${index}`}
              contact={contact}
            />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function EmptyContactsCard({ className }: { className?: string }) {
  return (
    <Card className={`w-full ${className}`}>
      <CardContent>
        <p className="text-sm text-muted-foreground">

        </p>
      </CardContent>
    </Card>
  );
}

function ContactItem({ contact }: { contact: Contact }) {
  return (
    <li className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src="" alt={contact.ContactName} />
          <AvatarFallback>
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        <div className="px-3 flex flex-col">
          <p className="text-sm font-bold leading-none">
            {contact.ContactType.Description}
          </p>
          <p className="text-sm font-medium leading-none pt-1">{contact.ContactName}</p>
        </div>
      </div>
    </li>
  );
}