import { screen, waitFor, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { renderApp } from './renderApp';
import { readTeam, seedTeam, server } from './server';

function failOnce(method: 'get' | 'post' | 'patch' | 'delete', path: string) {
  server.use(
    http[method](
      path,
      () => HttpResponse.json({ code: 'MOCK_FAILURE', message: '테스트용 오류' }, { status: 500 }),
      { once: true },
    ),
  );
}

function getCard(name: string) {
  const heading = screen.getByRole('heading', { name });
  const card = screen.getAllByRole('article').find((article) => article.contains(heading));
  if (!card) throw new Error(`${name} 카드를 찾지 못했어요.`);
  return within(card);
}

describe('내 팀 조회 (GET)', () => {
  it('팀이 비어 있으면 빈 상태를 보여 준다', async () => {
    renderApp('/my-team');

    expect(await screen.findByText('아직 팀에 포켓몬이 없어요')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '팀 저장' })).toBeDisabled();
  });

  it('조회에 실패하면 오류를 보여 주고, 다시 시도하면 팀을 불러온다', async () => {
    seedTeam([25]);
    failOnce('get', '/api/team');
    const { user } = renderApp('/my-team');

    expect(await screen.findByText('연결이 원활하지 않아요')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '다시 시도' }));

    expect(await screen.findByRole('img', { name: '피카츄 일러스트' })).toBeInTheDocument();
  });
});

describe('포켓몬 추가 (POST)', () => {
  it('추가에 성공하면 토스트를 띄우고 내 팀에 반영한다', async () => {
    const { user } = renderApp('/');

    await user.click(getCard('피카츄').getByRole('button', { name: '팀에 추가' }));

    expect(await screen.findByRole('status')).toHaveTextContent('피카츄를 팀에 추가했어요.');
    expect(getCard('피카츄').getByRole('button', { name: '추가됨' })).toBeInTheDocument();

    await user.click(within(screen.getByRole('navigation')).getByRole('link', { name: '내 팀' }));
    expect(await screen.findByRole('img', { name: '피카츄 일러스트' })).toBeInTheDocument();
  });

  it('요청이 끝날 때까지 추가 버튼을 잠가 중복 요청을 막는다', async () => {
    let postCount = 0;
    let release = () => {};
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    server.use(
      http.post('/api/team', async () => {
        postCount += 1;
        await gate;
      }),
    );
    const { user } = renderApp('/');

    await user.click(getCard('피카츄').getByRole('button', { name: '팀에 추가' }));

    const addButtons = await screen.findAllByRole('button', { name: '팀에 추가' });
    addButtons.forEach((button) => expect(button).toBeDisabled());
    await user.click(getCard('리자몽').getByRole('button', { name: '팀에 추가' }));

    release();
    expect(await screen.findByRole('status')).toHaveTextContent('피카츄를 팀에 추가했어요.');
    expect(postCount).toBe(1);
    expect(readTeam().map((item) => item.pokemonId)).toEqual([25]);
  });

  it('이미 팀에 있는 포켓몬은 요청 없이 중복 안내를 보여 준다', async () => {
    seedTeam([25]);
    let postCount = 0;
    server.use(
      http.post('/api/team', () => {
        postCount += 1;
      }),
    );
    const { user } = renderApp('/');

    const addedButton = await screen.findByRole('button', { name: '추가됨' });
    await user.click(addedButton);

    expect(await screen.findByText('이미 팀에 있는 포켓몬이에요')).toBeInTheDocument();
    expect(postCount).toBe(0);
  });

  it('6마리가 차면 추가 버튼을 막는다', async () => {
    seedTeam([25, 6, 1, 94, 133, 54]);
    renderApp('/');

    await waitFor(() =>
      expect(getCard('거북왕').getByRole('button', { name: '팀이 가득 찼어요' })).toBeDisabled(),
    );
  });

  it('추가에 실패하면 성공 토스트 없이 오류를 알리고, 다시 누르면 추가된다', async () => {
    failOnce('post', '/api/team');
    const { user } = renderApp('/');

    await user.click(getCard('피카츄').getByRole('button', { name: '팀에 추가' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '피카츄를 팀에 추가하지 못했어요. 다시 시도해 주세요.',
    );
    expect(screen.queryByText('피카츄를 팀에 추가했어요.')).not.toBeInTheDocument();
    expect(readTeam()).toHaveLength(0);

    await user.click(getCard('피카츄').getByRole('button', { name: '팀에 추가' }));

    expect(await screen.findByText('피카츄를 팀에 추가했어요.')).toBeInTheDocument();
    expect(readTeam().map((item) => item.pokemonId)).toEqual([25]);
  });
});

describe('팀 항목 편집 (PATCH)', () => {
  it('별명을 저장하면 내 팀으로 돌아와 성공 배너와 바뀐 별명을 보여 준다', async () => {
    seedTeam([25]);
    const { user } = renderApp('/my-team');

    await user.click(await screen.findByRole('link', { name: '편집' }));
    await user.type(screen.getByRole('textbox', { name: '별명 (선택)' }), '피카');
    await user.click(screen.getByRole('button', { name: '저장' }));

    expect(await screen.findByText('팀이 저장됐어요')).toBeInTheDocument();
    expect(screen.getByText('피카')).toBeInTheDocument();
    expect(readTeam()[0].nickname).toBe('피카');
  });

  it('저장에 실패하면 입력값을 유지하고, 다시 시도할 수 있다', async () => {
    seedTeam([25]);
    failOnce('patch', '/api/team/:id');
    const { user } = renderApp('/my-team');

    await user.click(await screen.findByRole('link', { name: '편집' }));
    const nicknameInput = screen.getByRole('textbox', { name: '별명 (선택)' });
    await user.type(nicknameInput, '피카');
    await user.click(screen.getByRole('button', { name: '저장' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('저장하지 못했어요. 다시 시도해 주세요.');
    expect(nicknameInput).toHaveValue('피카');
    expect(screen.queryByText('팀이 저장됐어요')).not.toBeInTheDocument();
    expect(readTeam()[0].nickname).toBe('');

    await user.click(screen.getByRole('button', { name: '다시 시도' }));

    expect(await screen.findByText('팀이 저장됐어요')).toBeInTheDocument();
    expect(readTeam()[0].nickname).toBe('피카');
  });
});

describe('팀 항목 삭제 (DELETE)', () => {
  it('삭제에 실패하면 항목을 남겨 두고, 다시 시도하면 그 항목만 삭제한다', async () => {
    seedTeam([25, 6]);
    failOnce('delete', '/api/team/:id');
    const { user } = renderApp('/my-team');

    await screen.findByRole('img', { name: '피카츄 일러스트' });
    await user.click(screen.getAllByRole('button', { name: '삭제' })[0]);
    await user.click(
      within(screen.getByRole('dialog', { name: '포켓몬 삭제' })).getByRole('button', { name: '삭제' }),
    );

    expect(await screen.findByRole('alert')).toHaveTextContent('저장하지 못했어요');
    expect(screen.getByRole('img', { name: '피카츄 일러스트' })).toBeInTheDocument();
    expect(screen.queryByText('팀이 저장됐어요')).not.toBeInTheDocument();
    expect(readTeam()).toHaveLength(2);

    await user.click(screen.getByRole('button', { name: '다시 시도' }));

    await waitFor(() =>
      expect(screen.queryByRole('img', { name: '피카츄 일러스트' })).not.toBeInTheDocument(),
    );
    expect(screen.getByRole('img', { name: '리자몽 일러스트' })).toBeInTheDocument();
    expect(screen.getByText('팀이 저장됐어요')).toBeInTheDocument();
    expect(readTeam().map((item) => item.pokemonId)).toEqual([6]);
  });
});