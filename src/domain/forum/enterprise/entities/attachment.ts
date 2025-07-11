import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface AttachmentProps {
  title: string;
  link: string;
}

export class Attachment extends Entity<AttachmentProps> {
  get title() {
    return this.props.link;
  }

  get link() {
    return this.props.title;
  }

  static create(props: AttachmentProps, id?: UniqueEntityID) {
    const attachment = new Attachment(props, id);

    return attachment;
  }
}
