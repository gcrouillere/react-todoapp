module Api::V1
  class IdeasController < ApplicationController
    def index
      @ideas = Idea.all.order(position: :asc)
      render json: @ideas
    end

    def create
      @idea = Idea.create(idea_params)
      render json: @idea
    end

    def update
      @idea = Idea.find(params[:id])
      @idea.update(idea_params)
      render json: @idea
    end

    def position_swap
      @target_idea = Idea.where(id: params[:target]).first
      @dragged_idea = Idea.where(id: params[:dragged]).first
      temp_target_idea_position = @target_idea.position
      @target_idea.update(position: @dragged_idea.position)
      @dragged_idea.update(position: temp_target_idea_position)
      @ideas = Idea.all.order(position: :asc)
      render json: @ideas
    end

    def destroy
      @idea = Idea.find(params[:id])
      if @idea.destroy
        head :no_content, status: :ok
      else
        render json: @idea.errors, status: :unprocessable_entity
      end
    end

    private

    def idea_params
      params.require(:idea).permit(:body, :title, :position, :location, :target, :dragged)
    end
  end
end
