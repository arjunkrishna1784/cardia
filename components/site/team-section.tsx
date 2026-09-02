import Image from "next/image";
import { User } from "lucide-react";

import { Reveal } from "@/components/site/reveal";
import { cardia, type TeamMember } from "@/lib/cardia-data";

/**
 * Team grid. Member data lives in lib/cardia-data.ts — until real
 * information is added there, neutral placeholders are rendered instead of
 * fabricated names, roles, or biographies.
 */
export function TeamSection() {
  const members: TeamMember[] = [...cardia.team];

  return (
    <section className="bg-[#050505]">
      <div className="mx-auto w-full max-w-7xl px-6 py-28 sm:py-32 lg:px-10">
        <Reveal as="header" className="max-w-2xl">
          <p className="font-mono text-[11px] tracking-[0.3em] text-white/35 uppercase">
            Team
          </p>
          <h2 className="mt-5 text-3xl leading-[1.08] font-light tracking-[-0.03em] text-foreground sm:text-4xl">
            The team behind CARDIA
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-white/55 sm:text-base">
            Five researchers and engineers working across computational
            biology, artificial intelligence, and cardiovascular disease
            informatics.
          </p>
        </Reveal>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {members.map((member, i) => (
            <Reveal
              as="li"
              key={member.name}
              delay={i * 90}
              className="rounded-[24px] border border-white/10 bg-gradient-to-b from-[#0B0B0E] to-[#08080a] p-6"
            >
              {member.photo ? (
                <Image
                  src={member.photo}
                  alt={`Portrait of ${member.name}`}
                  width={56}
                  height={56}
                  className="size-14 rounded-full border border-white/10 object-cover"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="flex size-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]"
                >
                  <User className="size-5 text-white/25" />
                </span>
              )}

              <h3 className="mt-5 text-base font-medium text-foreground">
                {member.name}
              </h3>
              {member.role && (
                <p className="mt-1 text-sm text-crimson-300/80">{member.role}</p>
              )}
              {member.bio && (
                <p className="mt-3 text-sm leading-relaxed text-white/50">
                  {member.bio}
                </p>
              )}
              {(member.linkedin || member.github) && (
                <p className="mt-4 flex gap-4 text-[13px]">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-sm text-white/50 underline-offset-4 transition-colors outline-none hover:text-white hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label={`${member.name} on LinkedIn`}
                    >
                      LinkedIn
                    </a>
                  )}
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-sm text-white/50 underline-offset-4 transition-colors outline-none hover:text-white hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label={`${member.name} on GitHub`}
                    >
                      GitHub
                    </a>
                  )}
                </p>
              )}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
