-- DropForeignKey
ALTER TABLE "JoinedEvent" DROP CONSTRAINT "JoinedEvent_eventId_fkey";

-- AddForeignKey
ALTER TABLE "JoinedEvent" ADD CONSTRAINT "JoinedEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
