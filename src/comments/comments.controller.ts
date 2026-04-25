import { Controller, Post, Param, Body, ParseUUIDPipe, Get, Patch, Delete } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller()
@UseGuards(AuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @Post('tasks/:taskId/comments')
  create(@Param('taskId', ParseUUIDPipe) taskId: string, @Body() createCommentDto: CreateCommentDto, @CurrentUser() user) {
    return this.commentsService.create(taskId, createCommentDto, user);
  }

  @Get('tasks/:taskId/comments')
  findAll(@Param('taskId', ParseUUIDPipe) taskId: string) {
    return this.commentsService.findAll(taskId);
  }

  @Get('comments/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.commentsService.findOne(id);
  }

  @Patch('comments/:id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(id, updateCommentDto);
  }

  @Delete('comments/:id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.commentsService.remove(id);
  }
}
