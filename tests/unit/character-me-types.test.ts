import { describe, expectTypeOf, it } from 'vitest';
import { CharacterMe, SWCombine } from '../../src/index.js';

type MeResponse = Awaited<ReturnType<SWCombine['character']['me']>>;

describe('Character.me() typing', () => {
  it('returns CharacterMe', () => {
    expectTypeOf<MeResponse>().toEqualTypeOf<CharacterMe>();
  });

  it('requires uid and name while allowing scope-based optional fields', () => {
    const minimal: MeResponse = {
      uid: '1:12345',
      name: 'Test Character',
    };

    expectTypeOf(minimal).toMatchTypeOf<MeResponse>();
    expectTypeOf<MeResponse['skills']>().toEqualTypeOf<CharacterMe['skills']>();
    expectTypeOf<MeResponse['privileges']>().toEqualTypeOf<CharacterMe['privileges']>();
    expectTypeOf<MeResponse['location']>().toEqualTypeOf<CharacterMe['location']>();
    expectTypeOf<MeResponse['credits']>().toEqualTypeOf<CharacterMe['credits']>();
  });

  it('types nested skills and privileges structures', () => {
    const sample: MeResponse = {
      uid: '1:12345',
      name: 'Test Character',
      skills: {
        value: {
          general: [
            {
              skill: [{ attributes: { type: 'strength' }, value: 3 }],
            },
          ],
        },
      },
      privileges: {
        value: {
          privilegegroup: [
            {
              privilege: [{ value: 'true' }],
            },
          ],
        },
      },
    };

    expectTypeOf(sample.skills?.value?.general?.[0].skill?.[0].attributes?.type).toEqualTypeOf<
      string | undefined
    >();
    expectTypeOf(sample.privileges?.value?.privilegegroup?.[0].privilege?.[0].value).toEqualTypeOf<
      'true' | 'false' | undefined
    >();
  });
});
