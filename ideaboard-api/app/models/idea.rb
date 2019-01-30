class Idea < ApplicationRecord

  after_create :set_position_attribute
  after_create :set_location_attribute

  def set_position_attribute
    self.update_columns(position: Idea.count) if position.nil?
  end

  def set_location_attribute
    self.update_columns(location: "wip") if location.nil?
  end
end
