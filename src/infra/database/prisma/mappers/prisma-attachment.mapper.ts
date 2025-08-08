import { Prisma } from 'generated/prisma';

import { Attachment } from '@/domain/forum/enterprise/entities/attachment';

export class PrismaAttachmentMapper {
  // static toDomain(raw: PrismaUser): Attachment {
  //   return Attachment.create(
  //     {
  //       name: raw.name,
  //       email: raw.email,
  //       password: raw.password,
  //     },
  //     new UniqueEntityID(raw.id),
  //   );
  // }

  static toPrisma(
    attachment: Attachment,
  ): Prisma.AttachmentUncheckedCreateInput {
    return {
      id: attachment.id.toString(),
      title: attachment.title,
      url: attachment.url,
    };
  }
}
