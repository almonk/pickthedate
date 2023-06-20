type Poll = {
  id: string;
	title: string;
	options: PollOption[];
  participants: Participant[];
};

type PollOption = {
  id: string;
  name: string;
  participantIds?: string[];
}

type Participant = {
  id: string;
  name: string;
  email: string | null;
}

enum AmButtonVariant {
  Primary =  'primary',
  Secondary = 'secondary',
  Tertiary = 'tertiary',
}