/*
 * SPDX-FileCopyrightText: syuilo and other misskey contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Inject, Injectable } from '@nestjs/common';
import { Endpoint } from '@/server/api/endpoint-base.js';
import { DI } from '@/di-symbols.js';
import type { NotesRepository } from '@/models/_.js';
import { GetterService } from '@/server/api/GetterService.js';
import { QueryService } from '@/core/QueryService.js';
import { ApiError } from '../../error.js';

export const meta = {
	tags: ['notes'],

	requireCredential: false,

	res: {
		type: 'object',
		optional: false, nullable: false,
	},

	errors: {
		noSuchNote: {
			message: 'No such note.',
			code: 'NO_SUCH_NOTE',
			id: '24fcbfc6-2e37-42b6-8388-c29b3861a08d',
		},
	},
} as const;

export const paramDef = {
	type: 'object',
	properties: {
		noteId: { type: 'string', format: 'misskey:id' },
	},
	required: ['noteId'],
} as const;

@Injectable()
export default class extends Endpoint<typeof meta, typeof paramDef> { // eslint-disable-line import/no-default-export
	constructor(
		@Inject(DI.notesRepository)
		private notesRepository: NotesRepository,

		private getterService: GetterService,
		private queryService: QueryService,
	) {
		super(meta, paramDef, async (ps, me) => {
			const query = await this.notesRepository.createQueryBuilder('note')
				.select('note.id')
				.where('note.id = :noteId', { noteId: ps.noteId });

			await this.queryService.generateVisibilityQuery(query, me);

			const note = await query.getOne();

			if (note === null) {
				throw new ApiError(meta.errors.noSuchNote);
			}

			const edits = await this.getterService.getEdits(ps.noteId).catch(err => {
				if (err.id === '9725d0ce-ba28-4dde-95a7-2cbb2c15de24') throw new ApiError(meta.errors.noSuchNote);
				throw err;
			});

			let editArray = [];

			for (const edit of edits) {
				editArray.push({
					oldDate: edit.oldDate as Date | null ?? null,
					updatedAt: edit.updatedAt,
					text: edit.oldText ?? edit.newText ?? null,
				});
			}

			editArray = editArray.sort((a, b) => { return new Date(b.oldDate ?? b.updatedAt).getTime() - new Date(a.oldDate ?? a.updatedAt).getTime(); });

			return editArray;
		});
	}
}
